import { pb, currentUser } from '../../../lib/pocketbase'

/** @type {import('./$types').PageLoad} */
export function load({ params }) {

    const getGroup = async() => {
        return await pb.collection('groups').getOne(`${params.id}`, { expand: 'owner_id' });
    }
    const group = getGroup();

    const getTasks = async() => {
        return await pb.collection('tasks').getFullList({filter: `group_id = '${params.id}'`, expand: 'completed_by_id'})
    }
    const tasks = getTasks();

    const isMember = async() => {
        try {
            return await pb.collection('user_groups').getFirstListItem(`user_id="${currentUser.id}" && group_id="${group.id}"`)
        } catch (err) {
            return false;
        }
    }
    const belongs = isMember();

    return {
        group: group,
        tasks: tasks,
        belongs: belongs
    };
}