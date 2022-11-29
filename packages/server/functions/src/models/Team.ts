export interface ITeam {
    name: string;
    color: string;
    owner: string;
    managers: string[];
    staff: string[];
}

export const mapToTeams = (id: string, data: any): ITeam => {
    return {
        name: id,
        color: data.color,
        owner: data.owner,
        managers: data.managers,
        staff: data.staff,
    };
};
