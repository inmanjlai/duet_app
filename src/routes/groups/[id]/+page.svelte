<script>
    import { currentUser, pb } from "../../../lib/pocketbase";
    import { onMount, onDestroy } from "svelte";
    import Task from "../../components/Task.svelte";
    import { goto } from '$app/navigation'
    import EditGroupDialog from "../../components/EditGroupDialog.svelte";

    export let data;
    let group = data.group;

    let modal;
    let deleteModal;
    let editModal;
    let belongs;

    const set = new Set(data.userGroups?.user_id);
    if (set.has($currentUser?.id)) belongs = true
    else belongs = false;
    
    const joinGroup = async() => {
        if(belongs) {
            pb.collection('user_groups').update(data.userGroups.id, {
                user_id: data.userGroups.user_id.filter((user) => user !== $currentUser.id)
            })
            belongs = false;
        } else {            
            pb.collection('user_groups').update(data.userGroups.id, {
                user_id: [...data.userGroups.user_id, $currentUser.id]
            })
            belongs = true;
        }
    }

    const deleteGroup = async() => {    
        await pb.collection('groups').delete(group.id);
        goto('/')
    }

    const createTask = async(e) => {
        const formData = new FormData(e.target)
        let data = {}
        for (let field of formData) {
            let [key, value] = field;
            data[key] = value;
        }

        data.group_id = group.id

        await pb.collection('tasks').create(data)
        e.target.reset();
        modal.close();
    }

    onMount(async() => {
        pb.collection('groups').subscribe('*', async(e) => {
            const owner_id = await pb.collection('users').getOne(e.record.owner_id);
            e.record.expand = {owner_id}
            group = e.record;
        })
        
        pb.collection('user_groups').subscribe('*', async(e) => {
            if (e.action == 'create') {
                data.userGroups = e.record
            }

            if (e.action == 'update') {
                data.userGroups = e.record
            }
        })

        pb.collection('tasks').subscribe('*', async(e) => {
            if (e.action == 'create') {
                const completed_by_id = await pb.collection('users').getOne(e.record.completed_by_id);
                e.record.expand = {completed_by_id}
                const group_id = await pb.collection('groups').getOne(e.record.group_id);
                e.record.expand = {group_id}
                data.tasks = [...data.tasks, e.record]
            }
           
            if (e.action == 'update') {
                const group_id = await pb.collection('groups').getOne(e.record.group_id);
                e.record.expand = {group_id}
                let taskToReplace = data.tasks.find((task) => task.id === e.record.id);
                let idx = data.tasks.indexOf(taskToReplace)
                data.tasks[idx] = e.record
            }

            if (e.action == 'delete') {
                data.tasks = data.tasks.filter((task) => task.id !== e.record.id)
            }
        })

    })

    onDestroy(() => {
        pb.collection('tasks').unsubscribe('*');
        pb.collection('groups').unsubscribe('*');
    })
</script>

<main>
    <div class="header">
        <div>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
            <p class="owner-p">Owned by <span class="owner">{group.expand?.owner_id?.username}</span></p>
            <p>{data.userGroups?.user_id?.length} members</p>
        </div>
        <div>
            {#if $currentUser}
            <div class="group-controls">
                {#if $currentUser && $currentUser.id == group.owner_id}
                <button on:click={() => deleteModal.showModal()}>Delete Group</button>
                <button on:click={() => editModal.showModal()}>Edit Group</button>
                {/if}
                <button on:click={joinGroup}>
                    {#if belongs}
                    Leave Group
                    {:else}
                    Join Group
                    {/if}
                </button>
            </div>
            {/if}
        </div>
    </div>

    <div>
        <h2 class="task-h2">Tasks 
            {#if $currentUser && group.owner_id === $currentUser.id}
                <button class="add-task" on:click={() => modal.showModal()}>
                    <span class="material-symbols-rounded">Add</span> 
                </button>
            {/if}
        </h2>
        <div class="tasks-container">
            {#each data.tasks as task}
                <Task task={task} belongs={belongs} />
            {/each}
        </div>
    </div>
</main>

<dialog bind:this={modal}>
    <form on:submit|preventDefault={createTask}>
        <label for="task">task</label>
        <input type="text" name="title" placeholder="task">
        <div>
            <button  class="secondary" type="button" on:click={() => modal.close()}>Cancel</button>
            <button>Add Task</button> 
        </div>   
    </form>
</dialog>

<dialog bind:this={deleteModal} class="delete-modal">
    <h1>Delete Group?</h1>
    <div class="delete-modal-controls">
        <button on:click={() => deleteModal.close()} class="secondary">Cancel</button>
        <button on:click={deleteGroup}>Confirm</button>
    </div>
</dialog>

<dialog bind:this={editModal}>
    <EditGroupDialog currentGroupData={group} modal={editModal} />
</dialog>

<style>
    .delete-modal h1 {
        margin-bottom: 15px;
        text-align: center;
    }

    .delete-modal-controls {
        display: flex;
        gap: 15px;
    }

    main {
        width: 100%;
        max-width: 1150px;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .group-controls {
        display: flex;
        gap: 15px;
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: 30px;
        justify-content: space-between;
    }
    
    .header button {
        padding: 10px;
        border: none;
        background-color: #2d2d2d;
        color: ghostwhite;
        border-radius: 5px;
        transition: box-shadow 0.3s, transform 0.3s;
    }

    .header button:hover {
        transform: translate(5px, -5px);
        box-shadow: -5px 5px 0px #2d2d2d50;
        cursor: pointer;
    }

    .owner-p {
        color: #2d2d2d80;
        font-size: 0.9rem;
    }

    .owner {
        color: #2d2d2d90;
        font-style: italic;
        font-weight: 600;
    }

    .tasks-container {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .add-task {
        all:unset;
        display: flex;
    }

    .task-h2 {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .task-h2 span {
        background-color: #2d2d2d;
        color: ghostwhite;
        border-radius: 50%;
        cursor: pointer;
    }

    dialog {
        border: 2px solid #2d2d2d;
        border-radius: 10px;
        width: 500px;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0 5px 10px #2d2d2d50;
    }

    dialog form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    dialog input {
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #2d2d2d20;
        flex-grow: 1;
    }

    dialog div {
        display: flex;
        gap: 15px;
    }

    dialog button {
        background-color: #2d2d2d;
        color: ghostwhite;
        padding: 10px;
        border: none;
        border-radius: 5px;
        flex-grow: 1;
        cursor: pointer;
    }

    .secondary {
        background-color: #2d2d2d80;
    }

    @media screen and (max-width: 670px) {
        .group-controls {
            width: 100%;
        }

        .group-controls button{
            flex-grow: 1;
        }
    }

</style>
