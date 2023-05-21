<script>
    import { currentUser, pb } from '../lib/pocketbase'

    let modal;

    const createGroupModal = () => {
        modal.showModal();
    }

    const closeGroupModal = () => {
        modal.close();
    }

    const createGroup = async(e) => {
        const formData = new FormData(e.target);
        let data = {
            owner_id: $currentUser.id
        }

        for (let field of formData) {
            let [key, value] = field;
            data[key] = value;
        }

        if (data.private == "on") data.private = true

        await pb.collection('groups').create(data);
        modal.close();
    }

</script>

<nav>
    <div class="logo">
        <h1><a href="/">Duet.</a></h1>
    </div>
    <ul>
        {#if $currentUser}
            <p>Logged in as {$currentUser.username}</p>
            <button on:click={createGroupModal} class="secondary" title="create group">
                <span class="material-symbols-rounded">Add</span>
            </button>
            <button on:click={() => pb.authStore.clear()}>Logout</button>
        {:else}
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign up</a></li>

        {/if}
    </ul>
    <dialog bind:this={modal}>
        <form on:submit|preventDefault={createGroup}>
            <h1>Create Group</h1>
            <button on:click={closeGroupModal} type="button" class="close-modal">
                <span class="material-symbols-rounded">
                    Close
                </span>
            </button>
            <label for="name">group name</label>
            <input type="text" name="name" placeholder="group name">

            <label for="group-description">group description</label>
            <textarea name="description" id="group-description" cols="30" rows="4" placeholder="describe the group!"></textarea>

            <div>
                <label for="slider">
                    <span class="material-symbols-rounded">
                        Lock
                    </span>
                    Private Group</label>
                <label class="switch">
                    <input id="slider" name='private' type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>

            <button>Create</button>
        </form>
    </dialog>
</nav>

<slot></slot>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px;
    }

    .logo {
        font-size: 2rem;
    }

    ul {
        display: flex;
        justify-content: center;
        list-style: none;
        font-size: 20px;
        gap: 30px;
        align-items: center;
    }

    ul a:hover {
        text-decoration: underline;
    }

    ul button {
        background-color: #2d2d2d;
        padding: 12px 24px;
        color: ghostwhite;
        font-size: 16px;
        border-radius: 5px;
        border: 2px solid #2d2d2d;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .secondary {
        background-color: white;
        border: 2px solid #2d2d2d;
        color: #2d2d2d;
    }

    button:hover {
        transform: translate(5px, -5px);
        box-shadow: -5px 5px 0px #2d2d2d50;
    }

    dialog {
        position: absolute;
        top: calc(50% - 231px);
        left: calc(50% - 200px);
        width: 400px;
        height: max-content;
        border: 2px solid #2d2d2d;
        border-radius: 10px;
        box-shadow: 0 5px 10px #2d2d2d20;
    }

    dialog:focus-visible {
        outline: transparent;
    }

    .close-modal {
        position: absolute;
        top: 30px;
        right: 30px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        color: #2d2d2d;
        display: flex;
        align-items: center;
        padding: 5px;
    }

    .close-modal:hover {
        box-shadow: none;
        transform: none;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 30px;
        gap: 10px;
    }

    form div {
        display: flex;
        gap: 30px;
        align-items: center;
        width: 100%;
    }

    form div label:first-child {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    form input[type="text"], form textarea {
        padding: 15px;
        font-size: 16px;
        font-family: 'Poppins', sans-serif;
        border-radius: 5px;
        border: none;
        background-color: #2d2d2d20;
        resize: none;
    }

    form button {
        background-color: #2d2d2d;
        color: ghostwhite;
        font-size: 16px;
        font-family: 'Poppins', sans-serif;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        border: none;
    }

    form button:hover {
        box-shadow: none;
        transform: translate(0, 0);
    }

    /* The switch - the box around the slider */
    .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    }

    /* Hide default HTML checkbox */
    .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    }

    /* The slider */
    .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2d2d2d20;
    -webkit-transition: .4s;
    transition: .4s;
    }

    .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    }

    input:checked + .slider {
    background-color: #2d2d2d;
    }

    input:focus + .slider {
    box-shadow: 0 0 1px #2d2d2d;
    }

    input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
    border-radius: 34px;
    }

    .slider.round:before {
    border-radius: 50%;
    }

</style>
