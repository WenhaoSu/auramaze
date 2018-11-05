import {ContentState, convertFromHTML, EditorState} from 'draft-js';

export function generateHighlightContent(highlight) {
    if (highlight) {
        let content = '';
        const properties = ['name', 'title', 'artist', 'museum', 'style', 'genre'];

        for (let property of properties) {
            const keys = Object.keys(highlight).filter(key => key.startsWith(property));
            content += keys.length ? `[${property}] <u>${highlight[keys[0]]}</u><br />` : '';
        }

        const introductions = Object.keys(highlight)
            .filter(key => key.startsWith('introduction'))
            .reduce((arr, key) => arr.concat(highlight[key]), []);
        content += introductions.join(' ... ');

        return content;
    } else {
        return '';
    }
}

export function convertHTMLToEditorState(html) {
    const blocksFromHTML = html && convertFromHTML(html);
    const contentState = blocksFromHTML && ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    );
    return contentState && EditorState.createWithContent(contentState);
}