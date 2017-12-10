class CONSTS {
    static get ROUTE() {
        return ''
    }

}

class AddBucketElement extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            name: 'example',
            key: 'example',
            text: 'example',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeKey = this.handleChangeKey.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("Add");
        $.post(CONSTS.ROUTE + "/addbucket", {
            name: this.state.name,
            key: this.state.key,
            text: this.state.text
        });
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleChangeKey(event) {
        this.setState({key: event.target.value});
    }

    handleChangeText(event) {
        this.setState({text: event.target.value});
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={this.handleChange}
                            placeholder="Name"
                        />
                    </label>
                    <br/>
                    <label>
                        Key:
                        <input
                            type="text"
                            value={this.state.key}
                            onChange={this.handleChangeKey}
                            placeholder="Key"
                        />
                    </label>
                    <br/>
                    <label>
                        File text value:
                        <input
                            type="text"
                            value={this.state.text}
                            onChange={this.handleChangeText}
                            placeholder="Text"
                        />
                    </label>
                    <br/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }


}

class DeleteBucketElement extends React.Component {
    constructor(props, context) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(event) {
        event.preventDefault();
        console.log("Delete");
        $.post(CONSTS.ROUTE + "/deletebucket", {
            name: this.props.name
        });
    }

    render() {
        return (
            <div>
                <button>
                    Do you really want to delete {this.props.name}?
                </button>
            </div>
        );
    }


}


class BucketListElement extends React.Component {
    constructor(props, context) {
        super(props);

        this.state = {
            Buckets: [],
            activeBucket: ''
        };


        this.getFilesFor = this.getFilesFor.bind(this);
        this.deleteBucket = this.deleteBucket.bind(this);
        this.getData = this.getData.bind(this);

        this.getData();
    }

    getData() {
        let self = this;
        console.log("Get list");
        $.ajax({
            url: CONSTS.ROUTE + "/listbucket",
            method: 'get',
            success: (data) => {
                self.setState({Buckets: data.Buckets})
            }
        })
    }

    getFilesFor(name) {
        return new Promise((res, rej) => {
            $.ajax({
                url: CONSTS.ROUTE + "/getfilesfor",
                data: {
                    name: name
                },
                method: 'get',
                success: (data) => {
                    res(data);
                }
            })
        })
    }

    deleteFile(bucket, file) {
        return new Promise((res, rej) => {
            $.ajax({
                url: CONSTS.ROUTE + "/deletefile",
                data: {
                    bucket: bucket,
                    name: file
                },
                method: 'POST',
                success: (data) => {
                    res(data);
                }
            })
        })
    }

    deleteBucket(name) {
        return new Promise((res, rej) => {
            $.ajax({
                url: CONSTS.ROUTE + "/deletebucket",
                data: {
                    name: name
                },
                method: 'POST',
                success: (data) => {
                    res(data);
                }
            })
        })
    }

    permissionFile(url) {
        return (bucket, file) => {
            return new Promise((res, rej) => {
                $.ajax({
                    url: CONSTS.ROUTE + "/" + url,
                    data: {
                        bucket: bucket,
                        name: file
                    },
                    method: 'POST',
                    success: (data) => {
                        res(data);
                    }
                })
            })
        };
    }


    render() {
        return (
            <table>
                {
                    this.state.Buckets.length ?
                        this.state.Buckets.map((data) => {

                            return (
                                <tr>
                                    <td>{data.Name}</td>
                                    <td>{data.CreationDate}</td>
                                    <td>
                                        <button onClick={() => {
                                            this.getFilesFor(data.Name).then((data2) => {
                                                this.setState({
                                                    showFiles: !this.state.showFiles,
                                                    files: data2,
                                                    activeBucket: data.Name
                                                })
                                            });
                                        }}>
                                            Show files
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => {
                                            this.deleteBucket(data.Name).then((data) => {
                                                this.setState({
                                                    showFiles: false,
                                                    files: []
                                                })
                                            });
                                        }}>
                                            Delete bucket
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : null
                }

                {
                    this.state.showFiles ?
                        this.state.files.map((data) => {
                            return (
                                <tr style={{background: '#f6fbff'}}>
                                    <td>{data.Key}</td>
                                    <td>{data.LastModified}</td>
                                    <td>Size {data.Size} b</td>
                                    <td>
                                        <a href={data.url}>
                                            Download file
                                        </a>
                                        <br/>
                                        <a href={`https://s3.amazonaws.com/${this.state.activeBucket}/${data.Key}`}>
                                            Show file
                                        </a>
                                        <br/>
                                        <button onClick={() => {
                                            this.deleteFile(
                                                this.state.activeBucket,
                                                data.Key
                                            ).then((d) => {
                                                this.getData();
                                            })
                                        }}>
                                            Delete file
                                        </button>
                                        <br/>
                                        <button onClick={() => {
                                            this.permissionFile('publicfile')(
                                                this.state.activeBucket,
                                                data.Key
                                            ).then((d) => {
                                                this.getData();
                                            })
                                        }}>
                                            Public
                                        </button>
                                        <br/>
                                        <button onClick={() => {
                                            this.permissionFile('privatefile')(
                                                this.state.activeBucket,
                                                data.Key
                                            ).then((d) => {
                                                this.getData();
                                            })
                                        }}>
                                            Private
                                        </button>
                                    </td>
                                </tr>
                            )
                        }) : null
                }
            </table>
        );
    }


}

class RootElement extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            showAdd: false,
            showDelete: false,
            showShowFiles: false,
            showBucketsList: false
        }
    }

    render() {
        return (
            <div>
                <button onClick={() => {
                    this.setState({showAdd: !this.state.showAdd})
                }}>
                    Add bucket
                </button>
                <button onClick={() => {
                    this.setState({showBucketsList: !this.state.showBucketsList})
                }}>
                    Show buckets list
                </button>
                {
                    this.state.showAdd ?
                        <AddBucketElement/>
                        : null
                }
                {
                    this.state.showBucketsList ?
                        <BucketListElement/>
                        : null
                }
            </div>
        );
    }
}


$(document).ready(() => {
    console.log("HI");
    ReactDOM.render(
        <RootElement/>,
        document.getElementById('root')
    );

});