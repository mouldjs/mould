import { Workspace } from "./Workspaces";
import { Provider, useSelector } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";
import reduceReducers from "reduce-reducers";
import { RadixProvider, Flex, Box } from "@modulz/radix";
import "normalize.css";
import { initialData } from "./utils";
import { EditorState } from "./types";
import "./app.css";
import { useEffect } from "react";
import { createProcessReducers } from "../lib/undo-redux";
import { Toolbar } from "./Toolbar";

function handleTouchMove(e) {
    e.preventDefault();
}

const App = () => {
    useEffect(() => {
        if (document) {
            document.addEventListener("wheel", handleTouchMove, {
                passive: false
            });

            return () => {
                document.removeEventListener("wheel", handleTouchMove);
            };
        }
    }, []);

    const testWorkspace = useSelector((state: EditorState) => {
        return state.testWorkspace;
    });

    return (
        <Flex flexDirection="column" minHeight="100vh" alignItems="stretch">
            <Box width="100vw" height={50}>
                <Toolbar></Toolbar>
            </Box>
            <Flex
                flex={1}
                overflow="hidden"
                flexDirection="row"
                alignItems="stretch"
                alignContent="stretch"
            >
                <Box flex={1}>
                    <Workspace {...testWorkspace}></Workspace>
                </Box>
                <Box width={300} height="100vh"></Box>
            </Flex>
        </Flex>
    );
};

export default () => {
    return (
        <Provider
            store={createStore(
                reduceReducers(initialData, createProcessReducers<
                    EditorState
                >()(...reducers) as any)
            )}
        >
            <RadixProvider>
                <App></App>
            </RadixProvider>
        </Provider>
    );
};
