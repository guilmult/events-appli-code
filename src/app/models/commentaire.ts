export interface Commentaire {
    id?: string
    author: string;
    date?: Date;
    comment: string;
    timestamp?: firebase.firestore.Timestamp;
}
