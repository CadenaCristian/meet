import Swal from "sweetalert2";
export const globalAlert = (type, title, text) => {
    Swal.fire({
        icon: type,
        title: `${title}`,
        showConfirmButton: false,
        text: `${text}`,
        timer: 2000,
    });
};
