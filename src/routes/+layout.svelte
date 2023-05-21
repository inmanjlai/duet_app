<script>
    import { currentUser, pb } from '../lib/pocketbase'
</script>

<nav>
    <div class="logo">
        <h1><a href="/">Duet.</a></h1>
    </div>
    <ul>
        {#if $currentUser}
            <p>Logged in as {$currentUser.username}</p>
            <button on:click={() => pb.authStore.clear()}>Logout</button>
        {:else}
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign up</a></li>
    
        {/if}
    </ul>
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
        padding: 15px;
        color: ghostwhite;
        font-size: 16px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
    }
</style>