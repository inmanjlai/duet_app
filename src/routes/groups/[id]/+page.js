import { pb, currentUser } from '../../../lib/pocketbase'

/** @type {import('./$types').PageLoad} */
export function load({ params }) {

    const getGroup = async() => {
        return await pb.collection('groups').getOne(`${params.id}`, { expand: 'owner_id' });
    }
    const group = getGroup();

    const getTasks = async() => {
        return await pb.collection('tasks').getFullList({filter: `group_id = '${params.id}'`, expand: 'completed_by_id,group_id'})
    }
    const tasks = getTasks();

    const getUserGroups = async() => {
        return await pb.collection('user_groups')
            .getFirstListItem(`group_id = "${params.id}"`, {expand: 'user_id'})
    }

    const userGroups = getUserGroups();

    return {
        group: group,
        tasks: tasks,
        userGroups: userGroups
    };
}