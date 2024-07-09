import { Button } from 'react-bootstrap';
import log from 'loglevel';
import React from 'react';
import DataTable from 'react-data-table-component';

function CustomTitle() {
  return <h1 className="title">Choose a prompt from the list.</h1>
}
type Props = {
  parentCallback: React.EventHandler<any>;
};
type State = {
  rowData?: any;
  pending: boolean;
};
interface DataRow {
  prompt_name: string;
  prompt_description: string;
  run_order: string;
  blurb1: string;
  blurb2: string;
  instruction: string;
  system_message: string;
  user_vars: string;
}
type ModelData = DataRow;

class PromptsView extends React.Component<Props, State> {
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

  onTrigger = (event: any) => {
    // Call the parent callback function
    const { parentCallback } = this.props;
    parentCallback(event as any);
    event.preventDefault();
  };

  async fetchData() {
    try {
      const result = await window.electron.pyRenderer.getPrompts();
      const data = JSON.parse(result);
      const rowData: DataRow[] = data.map((item: ModelData) => {
        const row: DataRow = {
          prompt_name: item.prompt_name as string,
          prompt_description: item.prompt_description as string,
          run_order: JSON.stringify(item.run_order as string),
          blurb1: item.blurb1 as string,
          blurb2: item.blurb2 as string,
          instruction: JSON.stringify(item.instruction as string),
          system_message: item.system_message as string,
          user_vars: JSON.stringify(item.user_vars as string),
        };
        return row;
      });
      this.setState({
        rowData,
        pending: false,
      });
    } catch (error) {
      log.error(`ERROR ${error}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  columns(): any[] {
    return [
      {
        name: '',
        cell: (row: any) => <this.ActionComponent row={row} />,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        grow: 3,
      },
      {
        name: 'Prompt Name',
        // eslint-disable-next-line no-underscore-dangle
        selector: (row: { prompt_name: string }) => row.prompt_name,
        sortable: true,
        grow: 1,
        width: '175px',
        wrap: true,
      },
      {
        name: 'Prompt Description',
        selector: (row: { prompt_description: string }) =>
          row.prompt_description,
        sortable: true,
        width: '175px',
        grow: 2,
        wrap: true,
      },
      {
        name: 'Run Order',
        selector: (row: { run_order: string }) => row.run_order,
        sortable: true,
        width: '150px',
        grow: 1,
        wrap: true,
      },
      {
        name: 'Blurb 1',
        selector: (row: { blurb1: string }) => row.blurb1,
        sortable: true,
        width: '175px',
        wrap: true,
      },
      {
        name: 'Blurb 2',
        selector: (row: { blurb2: string }) => row.blurb2,
        sortable: true,
        width: '165px',
        wrap: true,
      },
      {
        name: 'Instruction',
        selector: (row: { instruction: string }) => row.instruction,
        sortable: true,
        width: '185px',
        wrap: true,
      },
      {
        name: 'System Message',
        selector: (row: { system_message: string }) => row.system_message,
        sortable: true,
        width: '175px',
        wrap: true,
      },
      {
        name: 'User Vars',
        selector: (row: { user_vars: string }) => row.user_vars,
        sortable: true,
        width: '150px',
        wrap: true,
      },
    ];
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

export default PromptsView;
