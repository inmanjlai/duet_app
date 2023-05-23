<script>
    import { onMount } from "svelte";
    import { currentUser, pb } from "../../lib/pocketbase";

    export let task;
    export let belongs;

    let checked;
    let task_title;
        
    let set = new Set(task.completed_by_id);
    if (set.has($currentUser?.id)) {
        checked = true
    } else {
        checked = false
    }

    const completeTask = async() => {
        await pb.collection('tasks').update(`${task.id}`, {
            completed_by_id: [...task.completed_by_id, $currentUser.id]
        })
    }

    const resetTask = async() => {
        await pb.collection('tasks').update(`${task.id}`, {
            completed_by_id: [...task.completed_by_id.filter((user) => user !== $currentUser.id)]
        })
    }

    const deleteTask = async() => {
        await pb.collection('tasks').delete(task.id)
    }

</script>

<div>
    <p class="title" bind:this={task_title}>{task.title}</p>
    <span class="controls">
        <p class="completed-times">completed {task.completed_by_id?.length} times</p>
    {#if $currentUser && belongs}
        {#if $currentUser.id === task.expand.group_id.owner_id}
        <button on:click={deleteTask}>
            <span class="material-symbols-rounded">
                Delete
            </span>
        </button>
        {/if}
        <input 
            type="checkbox" 
            bind:checked={checked} 
            on:click={checked ? resetTask : completeTask}
        >
        {/if}
    </span>
</div>

<style>
    div {
        background-color: white;
        border: 2px solid #2d2d2d;
        border-radius: 5px;
        padding: 15px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div p {
        display: inline;
    }

    .controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }

    .controls button {
        background-color: transparent;
        border: none;
    }

    .controls button span {
        font-size: 25px;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #2d2d2d;
    }

    input[type="checkbox"] {
        height: 25px;
        width: 25px;
    }

    input[type="checkbox"]:checked  {
        accent-color: #2d2d2d;
    }   

    @media screen and (max-width: 670px) {
        .completed-times {
            display: none;
        }
    }
</style>