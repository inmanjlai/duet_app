import { pb } from '../../../lib/pocketbase'

/** @type {import('./$types').PageLoad} */
export function load({ params }) {

    const getGroups = async() => {
        return await pb.collection('groups').getList(1, 200, { expand: 'users', filter: `owner_id='${params.id}'` });
    }
    const groups = getGroups();

    const getUserGroups = async() => {
        return await pb.collection('user_groups')
            .getList(1, 200, {expand: 'group_id' , filter: `user_id='${params.id}'`})
    }
    const userGroups = getUserGroups();

    return {
        groups: groups,
        userGroups: userGroups
    };
}