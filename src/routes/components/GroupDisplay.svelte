<script>
    export let group;
</script>

<a href="/groups/{group.id}">
    <div>
        <h2>
            {#if group.private}
                <span class="material-symbols-rounded" title="private group">lock</span>
            {/if}
            {group.name}
        </h2>
        <p>
            {#if group.description.length > 100}
                {group.description.slice(0, 100)}...
            {:else}
                {group.description}
            {/if}
        </p>
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
        background-color: white;
        position: relative;
        transition: transform 0.3s, box-shadow 0.3s;
        cursor: pointer;
        height: 200px;
    }

    div h2 span {
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: #2d2d2d50;
    }

    div:hover {
        transform: translate(5px, -5px);
        box-shadow: -5px 5px 0px #2d2d2d50;
    }

    div p {
        overflow: hidden;
        max-width: 50ch;
        max-height: 50ch;
        text-overflow: ellipsis;
    }
</style>
