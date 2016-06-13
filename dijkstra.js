//returns path to closest known point, given the dest [isKnownPoint][function(node) : returns bool]
function dijkstra(nodes, source, frontier, dest_func) {

    //console.log("NEW ROUND FOR DIJKSTRA")

    //variables to check current frontier and setup next gen frontier
    var min_dist = Infinity,
        min_dist_node_index = -1,
        new_frontier = [],
        parent_node = -1;

    //search through each node in the frontier
    frontier.forEach(function(n) {
      //console.log("searching through frontier node: ")
      //console.log(n)

      var more_to_explore = false

      //for each link in the frontier, check if it is closer than the smallest distance found so far
      n.links.forEach(function(l) {

        //console.log("searching through links")
        //console.log(l)

        var indexOfPotentialNode = l.source == n.index ? l.target : l.source
        
        if (nodes[indexOfPotentialNode].dist != null) { //valid potential point to check
          if (nodes[indexOfPotentialNode].dist == Infinity) { //still has unexplored nodes so far
            
            //console.log("found infinity node")

            more_to_explore = true
            
            if (n.dist + l.value < min_dist ) {
             //console.log("found minimum")

             min_dist = n.dist + l.value
             min_dist_node_index = indexOfPotentialNode
             parent_node = n.index
            }
          }
        } else {
          nodes[indexOfPotentialNode].dist = Infinity
        }
      })

      if (more_to_explore) { //this node should be explored more in next dijkstra call
        new_frontier.push(n)
      }
    })

    if (min_dist_node_index > -1) {//found a new node to add to frontier

      //min_dist and the indexes are the lowest node, this will be added to frontier
      var new_frontier_node = nodes[min_dist_node_index]
      new_frontier_node.parent_node = parent_node  //nodes[min_dist_index].links[new_list_index]
      new_frontier_node.dist = min_dist
      new_frontier.push(new_frontier_node)

      if( dest_func(new_frontier_node)) { 
      //found the shortest path to a node that satisfies dest_func. ie found path to nearest known point
      //reconstruct path by going from latest entry to source, using best_link
        var path = [new_frontier_node.index];
        while (new_frontier_node.index != source.index) {
            path.push(new_frontier_node.parent_node)
            new_frontier_node = nodes[new_frontier_node.parent_node]
        }
        return path
      }

    } else {
      //no path to known point and no unexplored option... cannot explore anymore...
      console.log("OUT OF PATHS IN DIJKSTRA")
      return []
    }

    //recursive call to do next frontier, distance from source and best link are being updated
    return dijkstra(nodes, source, new_frontier, dest_func)
}
