import { getResponse } from '../../../../_shared/http/http';
import { API_UDP } from './udp.config';

/**
 * 🎯 Fetches all projects from the Urban Data Platform (UDP).
 * @returns {Object} 📤 An object containing project details indexed by project ID.
 */
export const getUDPProjects = () => {
    const response = getResponse(
        `${API_UDP}/action/package_search?q=&rows=9999`
    );
    const projects = JSON.parse(response.content);
    const result: any = {};
    for (const project of projects.result.results) {
        // console.log(project.license_id)
        result[project.id] = {
            title: project.title,
            state: project.state,
            name: project.name,
            license_id: project.license_id,
            resources: project.resources.map((res: any) => ({
                name: res.name,
                url: res.url,
                format: res.format,
            })),
        };
        // for (const ressource of ressources) {
        //     const header = getHttpBase(ressource.url, {
        //         method: 'GET',
        //         timeout: '5.0',
        //     });
        //     const details = `[${header.status}] ${ressource.url} (${project.title} - ${ressource.name})`;

        //     if (header.status !== '200') {
        //         LOG.FAIL(`Ressource not reachable: [${details})`);
        //         // console.log(header);
        //     } else {
        //         LOG.OK(`Ressource reachable: [${details})`);
        //     }
        // }
        // if(project.licsense_id !== '' && project.license_id !== null){
        //     LOG.OK(`Project: ${project.title} [${project.name}] [${project.license_id}] [${project.resources.length} resources]`);
        // }
    }
    return result;

    // get all projects
    // url -X GET "https://api.urbanedatenplattform-potsdam.de/ckan/api/action/package_search?q=&rows=9999"
};
