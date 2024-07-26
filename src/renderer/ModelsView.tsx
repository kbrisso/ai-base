import { Button } from 'react-bootstrap';
import React from 'react';
import DataTable from 'react-data-table-component';
import logger from './Logger';

function CustomTitle() {
  return <h1 className="title">Choose a model from the list.</h1>;
}

type Props = {
  parentCallback: React.EventHandler<any>;
};
type State = {
  rowData?: any;
  pending: boolean;
  row?: any;
};
interface DataRow {
  model_name: string;
  display_name: string;
  model_family: string;
  model_category: string;
  model_location: string;
  embedding_dims: string;
  context_window: string;
  link: string;
  custom_model_files: string;
  custom_model_repo: string;
}
type ModelData = DataRow;

class ModelsView extends React.Component<Props, State> {
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
        cell: (row: any) => <this.ActionComponent row={row} />,
        ignoreRowClick: true,
        allowoverflow: true,
        button: true,
        grow: 3,
      },
      {
        name: 'Model Name',
        // eslint-disable-next-line no-underscore-dangle
        selector: (row: { model_name: string }) => row.model_name,
        grow: 1,
        sortable: true,
        width: '175px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Display Name',
        selector: (row: { display_name: string }) => row.display_name,
        grow: 2,
        sortable: true,
        width: '175px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Model Family',
        selector: (row: { model_family: string }) => row.model_family,
        grow: 3,
        sortable: true,
        width: '175px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Model Category',
        selector: (row: { model_category: string }) => row.model_category,
        sortable: true,
        width: '175px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Model Location',
        selector: (row: { model_location: string }) => row.model_location,
        sortable: true,
        width: '125px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Embedding Dims',
        selector: (row: { embedding_dims: string }) => row.embedding_dims,
        sortable: true,
        width: '125px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Context Window',
        selector: (row: { context_window: string }) => row.context_window,
        sortable: true,
        width: '125px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Link',
        selector: (row: { link: string }) => row.link,
        sortable: true,
        width: '175px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Custom Model Files',
        selector: (row: { custom_model_files: string }) =>
          row.custom_model_files,
        sortable: true,
        width: '175px',
        wrap: true,
        allowoverflow: true,
      },
      {
        name: 'Custom Model Repo',
        selector: (row: { custom_model_repo: string }) => row.custom_model_repo,
        sortable: true,
        width: '175px',
        wrap: true,
        allowoverflow: true,
      },
    ];
  }

  async fetchData() {
    try {
      const result = await window.electron.pyRenderer.getGenLocalModels();
      const data = JSON.parse(result);
      const rowData: DataRow[] = data.map((item: ModelData) => {
        const row: DataRow = {
          model_name: item.model_name as string,
          display_name: item.display_name as string,
          model_family: item.model_family as string,
          model_category: item.model_category as string,
          model_location: item.model_location as string,
          embedding_dims: JSON.stringify(item.embedding_dims as string),
          context_window: JSON.stringify(item.context_window as string),
          link: JSON.stringify(item.link as string),
          custom_model_files: JSON.stringify(item.custom_model_files as string),
          custom_model_repo: JSON.stringify(item.custom_model_repo as string),
        };
        return row;
      });
      this.setState({
        rowData,
        pending: false,
      });
    } catch (error) {
      logger([error, 'error']);
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

export default ModelsView;
