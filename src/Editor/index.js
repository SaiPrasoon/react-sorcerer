import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import "./index.css";

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const customStyleMap = {
    BOLD: {
      fontWeight: "bold",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
    RED_LINE: {
      color: "red",
      textDecoration: "line-through",
    },
  };

  const removeCharacters = (length) => {
    const contentState = editorState.getCurrentContent();
    const block = contentState.getFirstBlock();

    const withoutHash = block.getText().substring(length);
    const newContentState = contentState.merge({
      blockMap: contentState
        .getBlockMap()
        .set(block.getKey(), block.merge({ text: withoutHash })),
    });
    setEditorState(
      EditorState.push(editorState, newContentState, "remove-hash")
    );
  };

  const handleBeforeInput = (chars, editorState) => {
    const text = editorState.getCurrentContent().getPlainText();

    if (chars === " " && text === "#") {
      removeCharacters(1);
      setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));

      return "handled";
    } else if (chars === " " && text === "*") {
      removeCharacters(1);
      setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));

      return "handled";
    } else if (chars === " " && text === "**") {
      removeCharacters(2);
      setEditorState(RichUtils.toggleInlineStyle(editorState, "RED_LINE"));

      return "handled";
    } else if (chars === " " && text === "***") {
      removeCharacters(3);
      setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));

      return "handled";
    }
    return "not-handled";
  };

  const handleChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleReturn = (e) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const key = selection.getStartKey();
    const currentBlock = currentContent.getBlockForKey(key);
    const isEmpty = currentBlock.getLength() === 0;

    if (isEmpty) {
      const newEditorState = RichUtils.insertSoftNewline(editorState);
      setEditorState(newEditorState);
      return "handled";
    }

    return "not-handled";
  };

  return (
    <>
      <div className="heading-container">
        <span className="heading">Demo Editor by Sai Prasoon</span>
        <button variant="contained" className="save-button" id="saveButton">
          Save
        </button>
      </div>

      <div className="editor-container">
        <Editor
          editorState={editorState}
          onChange={handleChange}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={customStyleMap}
          handleReturn={handleReturn}
        />
      </div>
    </>
  );
};

export default MyEditor;
