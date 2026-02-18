import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
interface EditorProps {
    props: {
        initialData?: string;
        onChange: (event: any, editor: ClassicEditor) => void;
    };
}
export default function Editor({ props }: EditorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Editor.d.ts.map