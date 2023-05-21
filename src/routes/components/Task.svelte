<script>
    import { currentUser, pb } from "../../lib/pocketbase";

    export let task;
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

</script>

<div>
    <p class="title" bind:this={task_title}>{task.title}</p>
    {#if $currentUser}
        <input 
            type="checkbox" 
            bind:checked={checked} 
            on:click={checked ? resetTask : completeTask}
        >
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

    input[type="checkbox"] {
        position: absolute;
        top: 12px;
        right: 12px;
        height: 30px;
        width: 30px;
        border: 2px solid #2d2d2d;
    }

    input[type="checkbox"]:checked  {
        accent-color: #2d2d2d;
    }   
</style>