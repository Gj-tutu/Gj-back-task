// Type definitions for react-router-redux v2.1.0
// Project: https://github.com/rackt/react-router-redux
// Definitions by: Isman Usoh <http://github.com/isman-usoh>, Noah Shipley <https://github.com/noah79>, Dimitri Rosenberg <https://github.com/rosendi>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../../typings/redux/redux.d.ts" />
/// <reference path="../../typings/react-router/react-router.d.ts"/>

declare namespace ReactRouterRedux {
    import R = Redux;
    import H = HistoryModule;

    const TRANSITION: string;
    const UPDATE_LOCATION: string;

    const push: PushAction;
    const replace: ReplaceAction;
    const go: GoAction;
    const goBack: GoForwardAction;
    const goForward: GoBackAction;
    const routeActions: RouteActions;

    type LocationDescriptor = H.Location | H.Path;
    type PushAction = (nextLocation: LocationDescriptor) => void;
    type ReplaceAction = (nextLocation: LocationDescriptor) => void;
    type GoAction = (n: number) => void;
    type GoForwardAction = () => void;
    type GoBackAction = () => void;

    interface RouteActions {
        push: PushAction;
        replace: ReplaceAction;
        go: GoAction;
        goForward: GoForwardAction;
        goBack: GoBackAction;
    }
    interface HistoryMiddleware extends R.Middleware {
        listenForReplays(store: R.Store, selectLocationState?: Function): void;
        unsubscribe(): void;
    }

    function routerReducer(state?: any, options?: any): R.Reducer;
    function syncHistoryWithStore(history: H.History, state?: any): H.History;
    function routerMiddleware(history: H.History): HistoryMiddleware;
}

declare module "react-router-redux" {
    export = ReactRouterRedux;
}
