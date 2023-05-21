import { pb } from '../../../lib/pocketbase'

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

    return {
        name: "Ismail Manjlai",
        group: group,
        tasks: tasks
    };
}