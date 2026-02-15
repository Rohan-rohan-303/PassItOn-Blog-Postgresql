import { useState, useEffect, useRef, useMemo } from 'react';
import {CKEditor}  from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Autoformat,
    AutoImage,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    BlockToolbar,
    Bold,
    CloudServices,
    Essentials,
    FindAndReplace,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    ShowBlocks,
    SimpleUploadAdapter,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextPartLanguage,
    TextTransformation,
    Title,
    TodoList,
    Underline,
    WordCount,
    type EditorConfig
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

// 1. Define the Props interface
interface EditorProps {
    props: {
        initialData?: string;
        onChange: (event: any, editor: ClassicEditor) => void;
    }
}

const LICENSE_KEY = 'GPL';

export default function Editor({ props }: EditorProps) {
    // 2. Add types to Refs
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const editorWordCountRef = useRef<HTMLDivElement>(null);
    const [isLayoutReady, setIsLayoutReady] = useState<boolean>(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    // 3. Type the config object using EditorConfig
    const config = useMemo(() => {
        if (!isLayoutReady) {
            return null;
        }

        const editorConfig: EditorConfig = {
            toolbar: {
                items: [
                    'sourceEditing', 'showBlocks', 'findAndReplace', 'textPartLanguage', '|',
                    'heading', '|', 'bold', 'italic', 'underline', '|',
                    'specialCharacters', 'pageBreak', 'link', 'insertImage', 'mediaEmbed',
                    'insertTable', 'blockQuote', 'htmlEmbed', '|',
                    'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                ],
                shouldNotGroupWhenFull: false
            },
            plugins: [
                Autoformat, AutoImage, Autosave, BalloonToolbar, BlockQuote, BlockToolbar, Bold,
                CloudServices, Essentials, FindAndReplace, FullPage, GeneralHtmlSupport,
                Heading, HtmlComment, HtmlEmbed, ImageBlock, ImageCaption, ImageInline,
                ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative,
                ImageToolbar, ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage,
                List, ListProperties, MediaEmbed, PageBreak, Paragraph, PasteFromOffice,
                ShowBlocks, SimpleUploadAdapter, SourceEditing, SpecialCharacters,
                SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials,
                SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText,
                Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties,
                TableToolbar, TextPartLanguage, TextTransformation, Title, TodoList,
                Underline, WordCount
            ],
            balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
            blockToolbar: [
                'bold', 'italic', '|', 'link', 'insertImage', 'insertTable', '|',
                'bulletedList', 'numberedList', 'outdent', 'indent'
            ],
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                ]
            },
            htmlSupport: {
                allow: [{ name: /^.*$/, styles: true, attributes: true, classes: true }]
            },
            image: {
                toolbar: [
                    'toggleImageCaption', 'imageTextAlternative', '|',
                    'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|',
                    'resizeImage'
                ]
            },
            initialData: props?.initialData || '',
            licenseKey: LICENSE_KEY,
            link: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                decorators: {
                    toggleDownloadable: {
                        mode: 'manual',
                        label: 'Downloadable',
                        attributes: { download: 'file' }
                    }
                }
            },
            list: {
                properties: { styles: true, startIndex: true, reversed: true }
            },
            placeholder: 'Type or paste your content here!',
            table: {
                contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
            }
        };

        return editorConfig;
    }, [isLayoutReady, props?.initialData]);

    return (
        <div className="main-container">
            <div
                className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-word-count"
                ref={editorContainerRef}
            >
                <div className="editor-container__editor">
                    <div ref={editorRef}>
                        {config && (
                            <CKEditor
                                editor={ClassicEditor}
                                config={config}
                                onChange={props.onChange}
                                onReady={(editor) => {
                                    const wordCount = editor.plugins.get('WordCount');
                                    if (editorWordCountRef.current) {
                                        editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
                                    }
                                }}
                                onAfterDestroy={() => {
                                    if (editorWordCountRef.current) {
                                        Array.from(editorWordCountRef.current.children).forEach(child => child.remove());
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className="editor_container__word-count" ref={editorWordCountRef}></div>
            </div>
        </div>
    );
}