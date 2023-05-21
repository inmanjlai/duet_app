<script>
    import GroupDisplay from "./components/GroupDisplay.svelte";

    const findGroups = async(e) => {
        const formData = new FormData(e.target);
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        console.log(data);
    }

    export let data;
</script>

<main>
    <form on:submit|preventDefault={findGroups}>
        <input type="search" name="search" placeholder="Find a group...">
        <button>
            <span class="material-symbols-rounded">
                search
            </span>
        </button>
    </form>
    <h1>Top Groups</h1>
    <div class="groups-container">
        {#each data.groups.items as group}
            <GroupDisplay group={group} />
        {/each}
    </div>
</main>


<style>
    main {
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 50px;
        align-items: center;
    }
    
    .groups-container {
        max-width: 1150px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        gap: 15px;
    }

    form {
        max-width: 1150px;
        width: 100%;
        display: flex;
    }

    input {
        padding: 15px;
        flex-grow: 1;
        border: 2px solid #2d2d2d;
        border-right: none;
        border-radius: 5px 0 0 5px;
        font-size: 16px;
        font-family: 'Poppins', sans-serif;
    }

    input:focus-visible {
        outline: transparent;
    }

    button {
        background-color: #2d2d2d;
        border: none;
        color: ghostwhite;
        padding: 15px;
        border-radius:0 5px 5px 0;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    button span {
        font-size: 24px;
        /* transform: translateY(3px); */
    }

    @media screen and (max-width: 650px) {
        .groups-container {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        }
    }
</style>