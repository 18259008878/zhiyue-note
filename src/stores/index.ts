import { createPinia } from "pinia";

import { useCurrentNoteStore } from "./currentNote";
import { useFreshNoteStore } from "./freshNote";


const pinia = createPinia();

export default pinia;

export {
    useCurrentNoteStore,
    useFreshNoteStore,
}