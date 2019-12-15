import { Commentaire } from './commentaire';

export interface Evenement {
    id?: string;
    titre?: string;
    description?: string;
    date?: any;
    inscrits?: string[];
    isInscrit?: boolean;
    lienSiteWeb?: string;
    status?: string;
    creationDate?: any;
    updateDate?: any;
    creator?: string;
    groupId?: string;
    messages?: Commentaire[];
    isRecentlyUpdated?: boolean;
}
