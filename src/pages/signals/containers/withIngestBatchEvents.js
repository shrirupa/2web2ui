import { connect } from 'react-redux';
import { getIngestBatchEvents } from 'src/actions/ingestBatchEvents';

const mapStateToProps = (state) => state.ingestBatchEvents;

const mapDispatchToProps = {
  getIngestBatchEvents
};

const withIngestBatchEvents = connect(mapStateToProps, mapDispatchToProps);

export default withIngestBatchEvents;
