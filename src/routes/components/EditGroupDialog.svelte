<script>
    import { currentUser, pb } from "../../lib/pocketbase";

    export let modal;
    export let currentGroupData;
    let isChecked = currentGroupData.private;

    const editGroup = async(e) => {
        const formData = new FormData(e.target);

        
        let data = {
            owner_id: $currentUser.id,
            private: isChecked
        }
        
        for (let field of formData) {
            let [key, value] = field;
            data[key] = value;
        }
        
        if (data.private == "on") data.private = true

        await pb.collection('groups').update(currentGroupData.id, data);
        
        modal.close();
    }
</script>

<form on:submit|preventDefault={editGroup}>
    <h1>Edit Group</h1>
    <label for="name">name</label>
    <input type="text" name="name" id="name" placeholder="name" value="{currentGroupData.name}">

    <label for="group-description">description</label>
    <textarea name="description" id="group-description" cols="30" rows="4" placeholder="description" value={currentGroupData.description}></textarea>

    <div>
        <label for="slider">
            <span class="material-symbols-rounded">
                Lock
            </span>
            Private Group</label>
        <label class="switch">
            <input id="slider" name='private' type="checkbox" 
                bind:checked={isChecked}
                on:change={(e) => isChecked = e.target.checked}
            >
            <span class="slider round"></span>
        </label>
    </div>

    <button type="button" class="secondary" on:click={() => modal.close()}>Cancel</button>
    <button>Confirm Changes</button>
</form>

<style>
    .secondary {
        background-color: #2d2d2d50;
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
        justify-content: space-between;
    }

    form div label:first-child {
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

    /* SLIDER CHECKBOX FROM W3 SCHOOLS */

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
    -webkit-transition: .3s;
    transition: .3s;
    }

    .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .3s;
    transition: .3s;
    }

    input:checked + .slider {
    background-color: #2d2d2d;
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