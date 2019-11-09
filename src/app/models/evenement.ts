export interface Evenement {
    id?: string;
    titre: string;
    description?: string;
    date?: Date;
    timestamp?: firebase.firestore.Timestamp
    inscrits?: string[];
    isInscrit?: boolean;
    lienSiteWeb?: string;
}
