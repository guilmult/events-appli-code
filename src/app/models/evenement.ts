export interface Evenement {
    id?: string;
    titre?: string;
    description?: string;
    date?: any;
    inscrits?: string[];
    isInscrit?: boolean;
    lienSiteWeb?: string;
    status?: string;
    creationDate?: Date;
    creator?: string;
}
