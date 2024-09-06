export default function incrementChatWithUsCounter() {
  /**
   * Oracle chat engagement engine is configured with new rule to show chat-with-us links based on variable change on window.
   * currently rule is configured to watch on 'chatwithus' on window scope. it justs looks for value to change to trigger chat
   * if agents are available, so in the below function we just toggle the value of 'chatwithus'
   * @type {boolean}
   */

  window.chatwithus = ++window.chatwithus || 0
}
