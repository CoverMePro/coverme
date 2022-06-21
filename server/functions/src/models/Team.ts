export interface ITeam {
    name: string;
    owner: string;
    managers: string[];
    staff: string[];
}

export const mapToTeams = (id: string, data: any): ITeam => {
    return {
        name: id,
        owner: data.owner,
        managers: data.managers,
        staff: data.staff,
    };
};
