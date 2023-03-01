import Swal from "sweetalert2";
import { TYPES } from "./enums";
import { query, collection, onSnapshot, doc, where, deleteDoc, } from "@firebase/firestore";
import { firestore } from "../../firebase_setup/firebase";
export const globalAlert = (type, title, text, time) => {
    Swal.fire({
        icon: type,
        title: `${title}`,
        showConfirmButton: false,
        text: `${text}`,
        timer: time,
        showCancelButton: true,
    });
};
export const deleteAlert = async () => {
    const { isConfirmed, isDismissed } = await Swal.fire({
        icon: TYPES.QUESTION,
        title: "¿Seguro de eliminar el conjunto?",
        text: "Si elimina el conjunto, se eliminaran todos los usuarios y todas preguntas relacionadas al conjunto",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    });
    return isConfirmed && !isDismissed ? true : false;
};
export const deleteMassive = async (id, collectionName, filter) => {
    try {
        let data = [];
        const collectionRef = collection(firestore, collectionName);
        const q = query(collectionRef, where(filter, "==", id));
        const unsub = onSnapshot(q, async (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            data.map(async (pos, index) => {
                await deleteDoc(doc(firestore, collectionName, pos?.id));
            });
        });
        return () => unsub();
    }
    catch (error) {
        globalAlert(TYPES.ERROR, "Eliminar", "Error al eliminar masivamente", 2000);
    }
};
