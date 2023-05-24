<script>
    import { pb, currentUser } from "../../../lib/pocketbase";
    import GroupDisplay from "../../components/GroupDisplay.svelte";
    import UserGroupDisplay from "../../components/UserGroupDisplay.svelte";
    import { onMount, onDestroy } from "svelte";

    export let data
    
    function getGroups() {
        return pb.collection('groups').getList(1, 200, { expand: 'users', filter: `owner_id=${$currentUser.id}` });
    }

    function getUserGroups() {
        return pb.collection('user_groups')
            .getList(1, 200, {
                expand: 'group_id' , 
                filter: `user_id~'${$currentUser.id}'`
            })
    }

    onMount(async() => {
        pb.collection('groups').subscribe('*', async(e) => {
            data.groups = await getGroups();
        })

        pb.collection('user_groups').subscribe('*', async(e) => {
            data.userGroups = await getUserGroups();
        })

    })

    onDestroy(() => {
        pb.collection('groups').unsubscribe('*');
        pb.collection('user_groups').unsubscribe('*')
    })

</script>

<main>
    <h1>Groups You Own</h1>
    <div class="groups-container">
        {#each data.groups.items as group}
            <GroupDisplay group={group} />
        {/each}
    </div>
    <h1>Groups You Joined</h1>
    <div class="groups-container">
        {#each data.userGroups.items as userGroup}
            <UserGroupDisplay group={userGroup} />
        {/each}
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 50px;
        padding: 30px;
    }

    h1 {
        text-align: center;
    }

    .groups-container {
        width: 100%;
        max-width: 1150px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 200px;
        gap: 15px;
    }

    @media screen and (max-width: 1000px) {
        .groups-container {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: auto;
        }
    }

    @media screen and (max-width: 800px) {
        .groups-container {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
        }
    }

    @media screen and (max-width: 550px) {
        .groups-container {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        }
    }
</style>