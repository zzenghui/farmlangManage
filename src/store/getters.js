export default {
  theme: state => state.theme,
  user: state => state.user,
  roles: state => state.roles,
  // job 
  indexFormWhere: state => state.job.indexFormWhere,
  webcamShow: state => state.job.webcamShow,
  currentSegmentedTableRow:state => state.job.currentSegmentedTableRow
}
