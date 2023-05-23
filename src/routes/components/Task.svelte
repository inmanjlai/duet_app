<script>
    import { currentUser, pb } from "../../lib/pocketbase";

    export let task;
    export let belongs;
    let checked;
    let task_title;
    task.completed_by_id !== "" ? checked = true : checked = false;

    const completeTask = async() => {
        await pb.collection('tasks').update(`${task.id}`, {
            completed_by_id: $currentUser.id
        })
    }

    const resetTask = async() => {
        await pb.collection('tasks').update(`${task.id}`, {
            completed_by_id: ""
        })
    }

    const deleteTask = async() => {
        await pb.collection('tasks').delete(task.id)
    }

</script>

<div>
    <p class="title" bind:this={task_title}>{task.title}</p>
    {#if $currentUser && belongs}
    <span class="controls">
        <button on:click={deleteTask}>
            <span class="material-symbols-rounded">
                Delete
            </span>
        </button>
        <input 
            type="checkbox" 
            bind:checked={checked} 
            on:click={checked ? resetTask : completeTask}
        >
    </span>
    {/if}
</div>

<style>
    div {
        background-color: white;
        border: 2px solid #2d2d2d;
        border-radius: 5px;
        padding: 15px;
        position: relative;
    }

    div p {
        display: inline;
    }

    .controls {
        position: absolute;
        top: 10px;
        right: 12px;
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .controls button {
        background-color: transparent;
        border: none;
    }

    .controls button span {
        font-size: 32px;
        cursor: pointer;
        color: #2d2d2d;
    }

    input[type="checkbox"] {
        height: 25px;
        width: 25px;
        transform: translateY(-3px);
    }

    input[type="checkbox"]:checked  {
        accent-color: #2d2d2d;
    }   
</style>