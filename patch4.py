import sys

with open('src/components/PipelineBuilder.tsx', 'r') as f:
    content = f.read()

target = '''            </div>
          </div>

        </div>

        {/* Right Code Display Column */}'''

replacement = '''            </div>
          </div>
          </div>

        </div>

        {/* Right Code Display Column */}'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/PipelineBuilder.tsx', 'w') as f:
        f.write(content)
    print("Patched final div successfully!")
else:
    print("Target not found!")
