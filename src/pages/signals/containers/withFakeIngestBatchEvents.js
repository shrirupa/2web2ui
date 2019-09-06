import { connect } from 'react-redux';
import { getIngestBatchEvents } from 'src/actions/ingestBatchEvents.fake';

const mapStateToProps = (state) => state.ingestBatchEvents;

const mapDispatchToProps = {
  getIngestBatchEvents // override with fake actions
};

const withFakeIngestBatchEvents = connect(mapStateToProps, mapDispatchToProps);

export default withFakeIngestBatchEvents;
