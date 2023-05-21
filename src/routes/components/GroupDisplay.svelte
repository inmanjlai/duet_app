<script>
    export let group;
</script>

<a href="/groups/{group.id}">
    <div>
        <h2>
            {#if group.private}
                <span class="material-symbols-rounded">lock</span>
            {/if}
            {group.name}
        </h2>
        <p>{group.description}</p>
    </div>
</a>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border: 2px solid #2d2d2d;
        border-radius: 5px;
        padding: 15px;
        box-shadow: 0 5px 10px #2d2d2d20;
        background-color: white;
        position: relative;
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        height: 100%;
    }

    div h2 span {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    div:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 15px #2d2d2d10;
    }
</style>