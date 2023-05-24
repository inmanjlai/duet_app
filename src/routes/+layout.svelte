<script>
    import { currentUser, pb } from '../lib/pocketbase'
    import CreateGroupDialog from './components/CreateGroupDialog.svelte';

    let modal;
</script>
<header>
    <nav>
        <div class="logo">
            <h1><a href="/">Duet.</a></h1>
        </div>
        <ul>
            {#if $currentUser}
            <p>Logged in as <a href="/users/{$currentUser.id}"><strong>{$currentUser.username}</strong></a></p>
            <div class="user-controls">               
                <button on:click={() => modal.showModal()} class="secondary" title="create group">
                    <span class="material-symbols-rounded">Add</span>
                </button>
                <button on:click={() => pb.authStore.clear()}>Logout</button>
            </div>
            {:else}
                <li><a href="/login">Login</a></li>
                <li><a href="/signup">Sign up</a></li>
    
            {/if}
        </ul>
    </nav>
</header>

<div class="modal-container">
    <dialog bind:this={modal}>
        <button on:click={() => modal.close()}>
            <span class="material-symbols-rounded">
                Close
            </span>
        </button>
        <CreateGroupDialog bind:this={modal} modal={modal} />
    </dialog>
</div>

<div class="wrapper">
    <slot></slot>
</div>

<style>
    .wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* padding: 30px; */
    }

    header {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 30px 0px;
    }

    nav {
        width: 100%;
        max-width: 1150px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 30px;
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
    
    .user-controls {
        display: flex;
        gap: 15px;        
    }

    .secondary {
        background-color: white;
        border: 2px solid #2d2d2d;
        color: #2d2d2d;
    }

    ul button:hover {
        transform: translate(5px, -5px);
        box-shadow: -5px 5px 0px #2d2d2d50;
    }

    ul p {
        width: max-content;
        flex-grow: 1;
    }

    dialog {
        padding: 0;
        border: 2px solid #2d2d2d;
        border-radius: 10px;
        box-shadow: 0 5px 10px #2d2d2d50;
        width: 500px;
    }

    dialog button span {
        height: 48px;
        display: flex;
        align-items: center;
    }

    dialog > button {
        background-color: transparent;
        border: none;
        position: absolute;
        top: 30px;
        right: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    @media screen and (max-width: 670px) {
        nav {
            flex-direction: column;
            gap: 30px;
        }

        nav ul {
            width: 100%;
            flex-direction: column;
        }

        .user-controls {
            width: 100%;
        }

        nav ul button {
            flex-grow: 1;
            justify-content: center;
        }

        dialog {
            padding: 0;
            width: 95%;
        }

    }


</style>
