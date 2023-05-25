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
    let taskButton;
    let commButton;
    let taskContainer;
    let commContainer;

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

    const openTasks = () => {
        commButton.classList.remove('active')
        commContainer.classList.add('hide')

        taskContainer.classList.remove('hide')
        taskButton.classList.add('active')

    }

    const openComm = () => {
        taskButton.classList.remove('active')
        taskContainer.classList.add('hide')

        commContainer.classList.remove('hide')
        commButton.classList.add('active')
    }

    onMount(async() => {
        pb.collection('groups').subscribe('*', async(e) => {
            const owner_id = await pb.collection('users').getOne(e.record.owner_id);
            e.record.expand = {owner_id}
            group = e.record;
        })

        pb.collection('user_groups').subscribe('*', async(e) => {
            data.userGroups = await pb.collection('user_groups').getFirstListItem(`group_id="${group.id}"`, {expand: "user_id"})
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
        pb.collection('user_groups').unsubscribe('*');
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
                <button on:click={() => deleteModal.showModal()}>Delete</button>
                <button on:click={() => editModal.showModal()}>Edit</button>
                {/if}
                <button on:click={joinGroup}>
                    {#if belongs}
                    Leave
                    {:else}
                    Join
                    {/if}
                </button>
            </div>
            {/if}
        </div>
    </div>

    <div class="tab-buttons">
        <button bind:this={taskButton} on:click={openTasks} class="active" id="tab"><h2>Tasks</h2></button>
        <button bind:this={commButton} on:click={openComm}  id="tab"><h2>Community</h2></button>
    </div>

    <div bind:this={taskContainer} class="tasks-container-wrapper">
        <h2 class="task-h2">
            {#if $currentUser && group.owner_id === $currentUser.id}
                Create Task
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

    <div class="hide comm-container" bind:this={commContainer}>
        <div class="messages">
            <p>Messages</p>
        </div>

        <div class="member-list">
            <div class="members">

                {#each data.userGroups?.expand?.user_id as member}
                <div class="member-div">
                    <p>{member.username}</p>
                    <p>{member.name}</p>
                </div>
                {/each}
            </div>
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
    .tasks-container-wrapper {
        background-color: #2d2d2d20;
        border: 2px solid #2d2d2d;
        border-top: none;
        border-radius: 0 0 5px 5px;
    }

    .tab-buttons {
        display: flex;
        border-bottom: 2px solid #2d2d2d;
        gap: 15px;
    }

    .comm-container {
        background-color: #2d2d2d20;
        border: 2px solid #2d2d2d;
        border-top: none;
        border-radius: 0 0 5px 5px;
        padding: 30px;
        display: grid;
        grid-template-columns: 3fr 1fr;
        grid-template-rows: 1fr;
    }

    #tab:first-child {
        margin-left: 30px;
    }

    #tab {
        border: none;
        background-color: #2d2d2d30;
        border: 2px solid #2d2d2d;
        border-bottom: 1px solid transparent;
        cursor: pointer;
        padding: 10px 30px 10px 30px;
        border-radius: 5px 5px 0 0;
        transform: translateY(2px);
    }

    #tab h2 {
        font-weight: 500;
    }

    #tab:hover {
        transform: translate(0, 2px);
        box-shadow: none;
    }

    #tab.active {
        border: 2px solid #2d2d2d;
        border-bottom: 1px solid #DFDFE4;
        background-color: #DFDFE4;
    }

    .members {
        display: flex;
        flex-direction: column;
        background-color: white;
        border: 2px solid #2d2d2d;
        border-radius: 5px;
    }

    .member-div:not(:last-child) {
        border-bottom: 2px solid #2d2d2d;
    }

    .member-div {
        padding: 15px;
        transition: background-color 0.3s;
    }

    .member-div:hover {
        background-color: #2d2d2d20;
    }

    .member-div p:first-child {
        font-weight: 700;
        font-size: large;
    }

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
    }

    .group-controls {
        display: flex;
        gap: 15px;
    }

    .group-controls > button {
        min-width: 80px;
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: 30px;
        justify-content: space-between;
        padding: 30px;
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
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 30px;
    }

    .add-task {
        all:unset;
        display: flex;
    }

    .task-h2 {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 30px 30px 0 30px;
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

    div.hide {
        display: none;
    }

    @media screen and (max-width: 1150px) {
        .tasks-container-wrapper, .comm-container {
            border-left: none;
            border-right: none;
            border-radius: 0;
        }
    }

    @media screen and (max-width: 670px) {
        .group-controls {
            width: 100%;
        }

        .group-controls button{
            flex-grow: 1;
        }

        .member-list {
            display: none;
        }
    }

</style>
