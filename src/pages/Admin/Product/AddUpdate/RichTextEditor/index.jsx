import React, {Component} from 'react';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from "prop-types";


export default class RichTextEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }


    static propTypes = {
        detail: PropTypes.string,
    }


    constructor(props) {
        super(props);
        const html = this.props.detail
        console.log('html: ', html)
        if (html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            };
        }
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };


    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    // console.log('response', response)
                    const url = response.data.url
                    // resolve(url);
                    resolve({data: {link: url}})
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    // 获得文本对应的html标签文本
    getDetail = () => {
        const {editorState} = this.state;
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }


    // componentDidMount 不可
    /* componentWillMount() {

         const html = this.props.detail
         console.log('html: ', html)
         if (html){
             const contentBlock = htmlToDraft(html);
             if (contentBlock) {
                 const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                 const editorState = EditorState.createWithContent(contentState);
                 this.state = {
                     editorState,
                 };
             }
         }else {
             this.state = {
                 editorState: EditorState.createEmpty()
             };
         }

     }*/


    render() {
        const {editorState} = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    // wrapperStyle={}
                    editorStyle={{minHeight: '150px', border: '1px solid #ccc', padding: '10px'}}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        // inline: { inDropdown: true },
                        // list: { inDropdown: true },
                        // textAlign: { inDropdown: true },
                        // link: { inDropdown: true },
                        // history: { inDropdown: true },
                        image: {uploadCallback: this.uploadImageCallBack, alt: {present: true, mandatory: true}},
                    }}
                />
                {/*<textarea
                    disabled='false'
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                    style={{width:"100%", minHeight:'50px'}}
                />*/}
            </div>
        );
    }
}