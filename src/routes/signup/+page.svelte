<script>
    import { currentUser, pb } from "../../lib/pocketbase"
    import { goto } from '$app/navigation'

    const signup = async(e) => {
        const formData = new FormData(e.target);
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        
        await pb.collection('users').create(data);
        await pb.collection('users').authWithPassword(data.username, data.password);
        goto('/');
    }
</script>

<main>
    {#if $currentUser}
        <h1>You're already logged in, you cheeky user.</h1>
    {:else}
        <form on:submit|preventDefault={signup}>
            <h1>Sign up</h1>
            <label for="name">full name</label>
            <input type="text" name="name" placeholder="full name" required>

            <label for="username">username</label>
            <input type="text" name="username" placeholder="username" required>

            <label for="email">email</label>
            <input type="email" name="email" placeholder="email" required>

            <label for="password">password</label>
            <input type="password" name="password" placeholder="password" required>

            <label for="passwordConfirm">confirm password</label>
            <input type="password" name="passwordConfirm" placeholder="confirm password" required>

            <button>Sign up</button>
            <a href="/login">Already signed up? Log in</a>
        </form>
    {/if}
</main>

<style>
    main {
        display: grid;
        gap: 30px;
        min-height: calc(100vh - 132px);
        place-items: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        border: 2px solid #2d2d2d;
        padding: 30px;
        border-radius: 10px;
        background-color: white;
        box-shadow: 0 5px 10px #2d2d2d20;
        width: 50%;            
        max-width: 800px;
        transition: 0.3s;
    }

    input, button {
        padding: 10px;
        font-size: 16px;
        border-radius: 5px;
    }

    input {
        /* border: 2px solid #2d2d2d; */
        border: none;
        background-color: #2d2d2d20;
    }

    button {
        background-color: #2d2d2d;
        color: ghostwhite;
        border: none;
        cursor: pointer;
    }

    a:hover {
        text-decoration: underline;
    }

    @media screen and (max-width: 650px) {
        form {
            width: 90%;
        }
    }
</style>