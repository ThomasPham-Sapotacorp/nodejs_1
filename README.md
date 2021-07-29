#dd#ấ

void dijkstraTT(int startNode) {
	double start, end, time;
	int i, j;
	int nextNode = 0;
	int distance[MAX], visited[MAX];

	for (i = 0; i < n; i++) {
		for (j = 0; j < n; j++) {
			cost[i][j] = G[i][j];
			if (G[i][j] == 0) cost[i][j] = INFINITY;
		}
	}

	start = GetTime();

	for (i = 0; i < n; i++) {
		visited[i] = 0;
		distance[i] = cost[startNode][i];
	}

	distance[startNode] = 0;
	visited[startNode] = 1;

	for (int k = 0; k < n - 1; k++) {
		int minDist = INFINITY;
		for (i = 0; i < n;i++) {
			if (distance[i] < minDist && !visited[i]) {
				minDist = distance[i];
				nextNode = i;
			}
		}
		

		visited[nextNode] = 1;
		
		for (i = 0; i < n;i++) {
			if (!visited[i]) {
				if (minDist + cost[nextNode][i] < distance[i]) {
					distance[i] = minDist + cost[nextNode][i];
				}
			}
		}
	}
	end = GetTime();
	time = end - start;
	printf("time TT: %0.09f", time);

	//for (i = 0; i < n; i++) 
	//	if (i != startNode) 
	//		printf("\ndistance of node %d = %d", i, distance[i]);
		
}
