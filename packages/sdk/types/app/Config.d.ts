declare namespace IAppConfig {
    interface Shortcuts {
        translate: string;
        rotate: string;
        scale: string;
        undo: string;
        focus: string;
    }

    interface Config {
        theme: 'os' | 'dark' | 'light';
        mainColor: string;
        history: boolean;
        shortcuts: Shortcuts;
        roamingCharacter: string;
    }
}