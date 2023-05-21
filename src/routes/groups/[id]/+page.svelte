<script>
    import { currentUser, pb } from "../../../lib/pocketbase";
    import { onMount, onDestroy } from "svelte";
    import Task from "../../components/Task.svelte";

    export let data;
    const group = data.group;
    let modal;

    const isMember = async() => {
        let results;
        
        try {
            results = await pb.collection('user_groups')
            .getFirstListItem(`user_id="${$currentUser.id}" && group_id="${group.id}"`);
            
            return results;
        } catch (err) {
            return false;
        }
        
    }
    
    const joinGroup = async() => {
        const belongsToGroup = await isMember();
        
        if(belongsToGroup) {
            pb.collection('user_groups').delete(belongsToGroup.id)
            data.belongs = false;
        } else {
            pb.collection('user_groups').create({user_id: `${$currentUser.id}`, group_id: `${group.id}`})
            data.belongs = true;
        }
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
        modal.close();

    }

    function getTasks() {
        return pb.collection('tasks').getFullList({filter: `group_id = '${group.id}'`, expand: 'completed_by_id'})

    }

    onMount(async() => {
        pb.collection('tasks').subscribe('*', async(e) => {
            data.tasks = await getTasks();
        })

        if (await isMember()) {
            data.belongs = true;
        } else {
            data.belongs = false;
        }

    })

    onDestroy(() => {
        pb.collection('tasks').unsubscribe('*');
    })

</script>

<main>
    <div class="header">
        <div>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
            <p class="owner-p">Owned by <span class="owner">{group.expand?.owner_id?.username}</span></p>
        </div>
        <div>
            {#if $currentUser}
                <button on:click={joinGroup}>
                    {#if data.belongs}
                    Leave Group
                    {:else}
                    Join Group
                    {/if}
                </button>
            {/if}
        </div>
    </div>

    <div>
        <h2 class="task-h2">Tasks 
            {#if $currentUser && data.belongs}
                <button class="add-task" on:click={() => modal.showModal()}>
                    <span class="material-symbols-rounded">Add</span> 
                </button>
            {/if}
        </h2>
        <div class="tasks-container">
            {#each data.tasks as task}
                <Task task={task} belongs={data.belongs}/>
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

<style>

    main {
        width: 100%;
        max-width: 1150px;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .header {
        display: flex;
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

</style>
