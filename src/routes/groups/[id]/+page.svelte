<script>
    import Task from "../../components/Task.svelte";

    export let data;
    const group = data.group;
</script>

<main>
    <div>
        <h1>{group.name}</h1>
        <p>{group.description}</p>
        <p class="owner-p">Owned by <span class="owner">{group.expand?.owner_id?.username}</span></p>
    </div>

    <div>
        <h2>Tasks</h2>
        <div class="tasks-container">
            {#each data.tasks as task}
                <Task task={task} />
            {/each}
        </div>
    </div>
</main>

<style>
    main {
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 30px;
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
</style>