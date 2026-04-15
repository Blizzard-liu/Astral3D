declare namespace IDataSource {
    interface Item {
        id: string;
        name: string;
        type: string;
        connectionString: string;
        username:string;
        password:string;
    }
}

declare namespace IDataSet {
    interface Item {
        id: string;
        groupId: string;
        name: string;
        type: string;
        method?: "GET" | "POST";
        api?: string;
        dataSource?: string;
        sql?: string;
        json?: string;
    }

    interface IGroup {
        id: string;
        pid?: string;
        name: string;
        children?: IGroup[];
    }
}