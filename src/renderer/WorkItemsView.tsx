import { Button } from 'react-bootstrap';
import React from 'react';
import DataTable from 'react-data-table-component';
import logger from './Logger';

function CustomTitle() {
  return <h1 className="title">Work Item view</h1>;
}
type Props = {
  parentCallback: React.EventHandler<any>;
};
type State = {
  rowData?: any;
  pending: boolean;
};
interface WorkItem {
  id?: number;
  modelName: string;
  promptName: string;
  queryText: string;
  responseText: string;
  contextText: string;
  notesText: string;
  dateTime: string;
}

type WorkItemData = WorkItem;

class WorkItemsView extends React.Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      rowData: undefined,
      pending: true,
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  ActionComponent = (row: any) => {
    return (
      <Button
        id={JSON.stringify(row)}
        onClick={this.onTrigger}
        variant="btn btn-sm btn-outline-dark"
      >
        Choose
      </Button>
    );
  };

  onTrigger = (event: { preventDefault: () => void }) => {
    // Call the parent callback function
    const { parentCallback } = this.props;
    parentCallback(event as any);
    event.preventDefault();
  };

  // eslint-disable-next-line class-methods-use-this
  columns(): any[] {
    return [
      {
        name: '',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (row: any) => <this.ActionComponent row={row} />,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        compact: true,
      },
      {
        name: 'Model Name',
        // eslint-disable-next-line no-underscore-dangle
        selector: (row: { modelName: string }) => row.modelName,
        sortable: true,
        width: '200px',
        maxWidth: '200px',
        minWidth: '100px',
        wrap: true,
        allowoverflow: true,
        compact: true,
        center: true,
      },
      {
        name: 'Prompt Name',
        selector: (row: { promptName: string }) => row.promptName,
        sortable: true,
        width: '200px',
        maxWidth: '200px',
        minWidth: '100px',
        wrap: true,
        allowoverflow: true,
        compact: true,
        center: true,
      },
      {
        name: 'Query',
        selector: (row: { queryText: string }) => row.queryText,
        sortable: true,
        width: '175px',
        maxWidth: '175px',
        minWidth: '0px',
        wrap: true,
        allowoverflow: true,
        compact: true,
        center: true,
      },
      {
        name: 'Response',
        selector: (row: { responseText: string }) => row.responseText,
        sortable: true,
        width: '250px',
        maxWidth: '250px',
        minWidth: '100px',
        wrap: true,
        allowoverflow: true,
        compact: true,
        center: true,
        grow: 1,
      },
      {
        name: 'Context',
        selector: (row: { contextText: string }) => row.contextText,
        sortable: true,
        width: '250px',
        maxWidth: '250px',
        minWidth: '100px',
        wrap: true,
        allowoverflow: true,
        compact: true,
        center: true,
        grow: 2,
      },
      {
        name: 'Notes',
        selector: (row: { notesText: string }) => row.notesText,
        sortable: true,
        width: '185px',
        maxWidth: '185px',
        minWidth: '100px',
        wrap: true,
        allowoverflow: true,
        compact: true,
        grow: 3,
      },
      {
        name: 'Date Time',
        selector: (row: { dateTime: string }) => row.dateTime,
        sortable: true,
        width: '150px',
        maxWidth: '150px',
        minWidth: '100px',
        wrap: true,
        allowoverflow: true,
        compact: true,
      },
    ];
  }

  async fetchData() {
    try {
      // @ts-ignore
      const result = await window.electron.pyRenderer.getWorkItems();
      // const data = JSON.stringify(result);

      const rowData: WorkItem[] = result.map((item: WorkItemData) => {
        const row: WorkItem = {
          modelName: item.modelName as string,
          promptName: item.promptName as string,
          responseText: item.responseText as string,
          queryText: item.queryText as string,
          contextText: item.contextText as string,
          notesText: item.notesText as string,
          dateTime: item.dateTime as string,
        };
        return row;
      });
      this.setState({
        rowData,
        pending: false,
      });
    } catch (error) {
      logger([error?.toString(), 'error']);
    }
  }

  render() {
    const { rowData, pending } = this.state;
    return (
      <div className="bg-light border rounded border-secondary shadow-lg">
        <button
          onClick={this.onTrigger}
          type="button"
          className="btn-close float-end"
          aria-label="Close"
        />
        <DataTable
          title={<CustomTitle />}
          columns={this.columns()}
          persistTableHead
          dense
          progressPending={pending}
          data={rowData}
          pagination
          paginationPerPage={25}
          fixedHeader
          striped
          fixedHeaderScrollHeight="750px"
        />
      </div>
    );
  }
}

export default WorkItemsView;
