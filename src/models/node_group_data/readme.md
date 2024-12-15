Each of the files in this folder represent a group of nodes that perform a specific task. The nodes have been separated and modularized to be used with other nodes.

The workflows should be constructed by assembling node groups in order.

Each Node group will include a collection of inputs provided by the front end and keys for nodes that act as inputs for other inputs. For instance, the Sampler node group requires a sampler input for things like steps and cfg, plus the keys of some nodes that produce data the node needs as an input, like the checkpoint node.

Workflows in this server should be constructed with collections of other nodes that are modular enough to work with other node collections
