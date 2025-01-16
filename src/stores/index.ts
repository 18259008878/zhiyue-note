import { createPinia } from "pinia";

import { useNoteStore } from "./noteStore";


const pinia = createPinia();

export default pinia;

export {
    useNoteStore,
}