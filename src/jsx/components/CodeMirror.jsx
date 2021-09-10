import React, { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "@codemirror/basic-setup";
import { topic } from "../../js/cells/topics.js";
import { defer } from "../../js/cells/async.js";
import API from "../../js/cells/api.js";

const guid = () => {
  const u = URL.createObjectURL(new Blob([""]));
  URL.revokeObjectURL(u);
  return u.split("/").slice(-1)[0];
};

// --
// The update mechanism uses a topic tree. When an editor is created, it
// is a assigned a GUI. This GUID can then be used to communicate values
// to the parent component through a subscription callback.
const onUpdate = (topic) => {
  const deferred = defer();
  return (view) => {
    const doc = view.state.doc;
    const value = doc.toString();
    const lines = [...doc.toJSON()];
    topic.pub({ value, lines });
    deferred.push(
      1000,
      () => {
        API.parse("python", value).then((_) => _.json()).then((_) => {
          console.log("Parsed", _);
        });
        API.eval("python", value).then((_) => _.json()).then((_) => {
          console.log("Eval", _);
        });
      },
    );
  };
};

const CodeMirror = (props) => {
  const initialValue = props.value instanceof Array
    ? props.value.join("\n")
    : props.value;
  const [editor, setEditor] = useState(null);
  const [editorID, setEditorID] = useState(null);
  const ref = useRef();

  useEffect(() => {
    if (!editorID) setEditorID(guid());
  }, [editorID]);

  useEffect((_) => {
    if (ref.current && editorID) {
      // TODO: We could map that editor to feeds
      const editor_topic = topic(`editor/${editorID}`);
      const state = EditorState.create({
        doc: initialValue,
        extensions: [
          basicSetup,
          EditorView.updateListener.of(onUpdate(editor_topic)),
        ],
      });
      state.guid = guid();
      const view = new EditorView({
        state: state,
        parent: ref.current,
      });
      setEditor(view);
      return () => {
        view.destroy();
        editor_topic.clear();
        setEditor(null);
      };
    }
  }, [ref, editorID, initialValue]);

  return (
    <div className={`CodeMirror ${props.className || ""}`}>
      <div ref={ref} />
    </div>
  );
};

export default CodeMirror;
