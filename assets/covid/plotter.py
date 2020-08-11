import numpy as np
import pandas as pd
from plotly.subplots import make_subplots
import plotly.graph_objects as pgo

# MODE
mode = "save" # Set to plot or save

# Initialisation
data = pd.read_csv("cases.csv", header=None)
data[0] = pd.to_datetime(data[0])
data.columns = ["Date", "Locality", "Count"]
data = data.set_index("Date")

# Segregating data
data_local = data[data["Locality"] == "Local"]["Count"].sort_index()
data_imported = data[data["Locality"] == "Imported"]["Count"].sort_index()
data_total = data_local.add(data_imported, fill_value=0).sort_index()

# Main dataframes
cases_total_day = data_total.cumsum().sort_index()
cases_total_case = pd.concat([cases_total_day, data_total], axis=1)
cases_total_case.columns = ["Total cases", "New cases"]
cases_total_case = cases_total_case.set_index('Total cases')

cases_local_day = data_local.cumsum().sort_index()
cases_local_case = pd.concat([cases_local_day, data_local], axis=1)
cases_local_case.columns = ["Total cases", "New cases"]
cases_local_case = cases_local_case.set_index('Total cases')

# Plotting main traces
fig = make_subplots(rows=2, cols=2,
                    subplot_titles=['Total cases',
                                    'New cases per day',
                                    'Cases against new cases',
                                    'Community cases against new cases'],
                    vertical_spacing=0.12
                    )

fig.add_trace(
    pgo.Scatter(x=cases_local_day.index, y=cases_local_day.values, mode='lines', name='Community'),
    row=1, col=1
)

fig.add_trace(
    pgo.Scatter(x=data_local.index, y=data_local.values, mode='lines', name='Community'),
    row=1, col=2
)

fig.add_trace(
    pgo.Scatter(x=cases_total_day.index, y=cases_total_day.values, mode='lines', name='Total'),
    row=1, col=1
)

fig.add_trace(
    pgo.Scatter(x=data_total.index, y=data_total.values, mode='lines', name='Total'),
    row=1, col=2,
)

fig.add_trace(
    pgo.Scatter(x=cases_total_case.index, y=cases_total_case['New cases'], mode='lines', name=''),
    row=2, col=1
)

fig.add_trace(
    pgo.Scatter(x=cases_local_case.index, y=cases_local_case['New cases'], mode='lines', name=''),
    row=2, col=2
)

# Averages
max_total = cases_total_day.iloc[-1]
max_local = cases_local_day.iloc[-1]

fig.add_trace(
    pgo.Scatter(x=[0, max_total], y=[0, max_total/10], mode='lines', name='Average growth'),
    row=2, col=1
)

fig.add_trace(
    pgo.Scatter(x=[0, max_local], y=[0, max_local/10], mode='lines', name='Average growth'),
    row=2, col=2
)

fig.update_layout(showlegend=False)
fig['layout'].update(margin=dict(l=0,r=0,b=0,t=30))

# Finalisation
if mode == "plot":
    print("Plotting")
    fig.show(config={'displayModeBar': False})
elif mode == "save":
    print("Saving")
    fig.write_html("export.html", config={'displayModeBar': False})
else:
    print("Error: set a mode")
