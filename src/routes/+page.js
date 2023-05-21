import { pb } from '../lib/pocketbase'

/** @type {import('./$types').PageLoad} */
export function load({ params }) {

    const getGroups = async() => {
        return await pb.collection('groups').getList(1, 20, { expand: 'users', filter: 'private=false' });
    }
    const groups = getGroups();

    return {
        name: "Ismail Manjlai",
        groups: groups
    };
}